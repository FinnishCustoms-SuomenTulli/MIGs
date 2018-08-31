<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:variable name="language">en</xsl:variable>
	<xsl:template match="/">
		<div class="container">
			<div>
				<a href="../../common/codelists.xml">
				<xsl:choose>
					<xsl:when test="$language='fi'"><span class="icon icon-tulli-external" style="margin-right:3px"/>Lataa koodistot XML-muodossa</xsl:when>
					<xsl:when test="$language='sv'"><span class="icon icon-tulli-external" style="margin-right:3px"/>Ladda ner kodlistorna i XML-format</xsl:when>
					<xsl:when test="$language='en'"><span class="icon icon-tulli-external" style="margin-right:3px"/>Download codelists XML format</xsl:when>
				</xsl:choose>
				</a>
				<p/>
			</div>
			<div class="row">
				<div class="col-md-3 col-sm-3 sidebar" role="complementary">
					<nav id="nav-sidebar" class="hidden-print collapse navbar-collapse" data-spy="affix" data-offset-top="210">
						<ul class="nav nav-stacked">
							<xsl:for-each select="CodeLists/CodeList">
								<li>
									<xsl:if test="position()=1">
										<xsl:attribute name="class">active</xsl:attribute>
									</xsl:if>
									<a>
										<xsl:attribute name="href"><xsl:value-of select="concat('#CODELIST_',Identification)"/></xsl:attribute>
										<xsl:value-of select="Name[@lang=($language)]"/>
									</a>
								</li>
							</xsl:for-each>
						</ul>
					</nav>
				</div>
				<div class="col-md-9 col-sm-9 col-xs-12" role="main">
					<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
						<xsl:for-each select="CodeLists/CodeList">
							<div class="panel panel-primary">
								<div class="panel-heading" role="tab" id="heading-colors">
									<h2 class="panel-title">
										<a role="button" data-toggle="collapse" data-parent="#accordion" aria-expanded="true">
											<xsl:attribute name="id"><xsl:value-of select="concat('CODELIST_',Identification)"/></xsl:attribute>
											<xsl:attribute name="aria-controls"><xsl:value-of select="concat('CODELIST_',Identification)"/></xsl:attribute>
											<xsl:value-of select="concat('CODELIST ',Identification)"/> - <xsl:value-of select="Name[@lang=($language)]"/>
										</a>
									</h2>
								</div>
							</div>
							<div class="panel-collapse collapse in" role="tabpanel">
								<xsl:attribute name="id"><xsl:value-of select="concat('CODELIST_',Identification)"/></xsl:attribute>
								<xsl:attribute name="aria-labelledby"><xsl:value-of select="concat('heading_CODELIST_',Identification)"/></xsl:attribute>
								<xsl:value-of select="Description[@lang=($language)]"/>
								<table class="table table-striped table-hover table-responsive">
									<thead>
										<tr>
											<th>Code</th>
											<th>Name</th>
											<xsl:if test="count(CodeItem/Description[@lang=($language)][string(.)]) > 0">
												<th>Description</th>
											</xsl:if>
										</tr>
									</thead>
									<xsl:for-each select="CodeItem">
										<xsl:if test="Valid!='False'">
											<tr>
												<td>
													<!--span class="icon icon-tulli-info" style="margin-right:3px"></span-->
													<xsl:value-of select="Code"/>
												</td>
												<td>
													<xsl:value-of select="Name[@lang=($language)]"/>
												</td>
												<xsl:if test="count(../CodeItem/Description[@lang=($language)][string(.)]) > 0">
													<td>
														<xsl:value-of select="Description[@lang=($language)]"/>
													</td>
												</xsl:if>
											</tr>
										</xsl:if>
									</xsl:for-each>
								</table>
							</div>
						</xsl:for-each>
					</div>
				</div>
			</div>
		</div>
	</xsl:template>
</xsl:stylesheet>
