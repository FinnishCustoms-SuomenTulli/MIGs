<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:param name="language"/>
	<xsl:param name="messageType"/>
	<xsl:template match="/">
		<xsl:if test="Message/Rule!='' and Message/Rule/@use=$messageType">
			<p>
				<b>Rules:</b>
				<xsl:for-each select="Message/Rule">
					<xsl:value-of select="."/>
					<xsl:if test="position() != last()">, </xsl:if>
				</xsl:for-each>
			</p>
		</xsl:if>
		<table class="table table-responsive">
			<thead>
				<tr>
					<xsl:choose>
						<xsl:when test="$language='fi'">
							<th>
								Data element/group
							</th>
							<th>
								Tietoelementti/-ryhmä
							</th>
							<th>
								Required?
							</th>
							<th>
								Cardinality/Format
							</th>
							<th>
								Path
							</th>
							<th>
								R/C
							</th>
							<th>
								Code list
							</th>
						</xsl:when>
					</xsl:choose>
				</tr>
			</thead>
			<xsl:for-each select="descendant::DataGroup | descendant::DataElement">
				<xsl:choose>
					<xsl:when test="local-name()='DataGroup'">
						<xsl:if test="Use = $messageType">
							<tr>
								<td>
									<b>
										<xsl:value-of select="Name[@lang='en']"/>
									</b>
								</td>
								<td>
									<b>
										<xsl:value-of select="Name[@lang='fi']"/>
									</b>
								</td>
								<td>
									<b>
										<xsl:choose>
											<xsl:when test="Condition[@use=$messageType] != ''">D</xsl:when>
											<xsl:when test="Condition[not(@*)] != ''">D</xsl:when>
											<xsl:when test="MinOccurence[@use=$messageType]=0">O</xsl:when>
											<xsl:when test="MinOccurence[@use=$messageType]>0">R</xsl:when>
											<xsl:when test="MinOccurence[not(@*)]>0">R</xsl:when>
											<xsl:otherwise>O</xsl:otherwise>
										</xsl:choose>
									</b>
								</td>
								<td>
									<b>
										<xsl:choose>
											<xsl:when test="MaxOccurence[@use=$messageType] != ''">
												<xsl:value-of select="MaxOccurence[@use=$messageType]"/>x</xsl:when>
											<xsl:otherwise>
												<xsl:value-of select="MaxOccurence"/>x</xsl:otherwise>
										</xsl:choose>
									</b>
								</td>
								<td>
									<b>
										<xsl:value-of select="$messageType"/>
										<xsl:for-each select="ancestor-or-self::*">
											<xsl:value-of select="XPath"/>
											<xsl:if test="position() != last() and position() != 1">/&#8203;</xsl:if>
										</xsl:for-each>
									</b>
								</td>
								<td>
									<b>
										<xsl:for-each select="Rule[@use=$messageType] | Rule[not(@*)] | Condition[@use=$messageType] | Condition[not(@*)]">
											<xsl:value-of select="."/>
											<xsl:if test="position() != last()">, </xsl:if>
										</xsl:for-each>
									</b>
								</td>
								<td>
								</td>
							</tr>
						</xsl:if>
					</xsl:when>
					<xsl:otherwise>
						<xsl:if test="Use = $messageType">
							<tr>
								<td>
									<xsl:value-of select="Name[@lang='en']"/>
								</td>
								<td>
									<xsl:value-of select="Name[@lang='fi']"/>
								</td>
								<td>
									<xsl:choose>
										<xsl:when test="Condition[@use=$messageType] != ''">D</xsl:when>
										<xsl:when test="Condition[not(@*)] != ''">D</xsl:when>
										<xsl:when test="MinOccurence[@use=$messageType]=0">O</xsl:when>
										<xsl:when test="MinOccurence[@use=$messageType]>0">R</xsl:when>
										<xsl:when test="MinOccurence[not(@*)]>0">R</xsl:when>
										<xsl:otherwise>O</xsl:otherwise>
									</xsl:choose>
								</td>
								<td>
									<xsl:value-of select="Format"/>
								</td>
								<td>
									<xsl:value-of select="$messageType"/>
									<xsl:for-each select="ancestor-or-self::*">
										<xsl:value-of select="XPath"/>
										<xsl:if test="position() != last() and position() != 1">/&#8203;</xsl:if>
									</xsl:for-each>
								</td>
								<td>
									<xsl:for-each select="Rule[@use=$messageType] | Rule[not(@*)] | Condition[@use=$messageType] | Condition[not(@*)]">
										<xsl:value-of select="."/>
										<xsl:if test="position() != last()">, </xsl:if>
									</xsl:for-each>
								</td>
								<td>
									<xsl:for-each select="Codelist[@use=$messageType] | Codelist[not(@*)]">
										<xsl:value-of select="."/>
										<xsl:if test="position() != last()">, </xsl:if>
									</xsl:for-each>
								</td>
							</tr>
						</xsl:if>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:for-each>
		</table>
	</xsl:template>
</xsl:stylesheet>
