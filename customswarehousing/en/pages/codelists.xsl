<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:variable name="language">en</xsl:variable>
	<xsl:template match="/">
		<xsl:for-each select="CodeLists/CodeList">
			<div class="panel panel-primary">
				<div class="panel-heading" role="tab" id="heading-colors">
					<h2 class="panel-title">
						<a>
							<xsl:attribute name="id"><xsl:value-of select="concat('CODELIST_',Identification)"/></xsl:attribute>
							<xsl:value-of select="concat('CODELIST ',Identification)"/> - <xsl:value-of select="Name[@lang=($language)]"/>
						</a>
					</h2>
				</div>
			</div>
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
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>
